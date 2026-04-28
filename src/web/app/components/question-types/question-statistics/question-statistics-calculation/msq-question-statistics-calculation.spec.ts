import { MsqQuestionStatisticsCalculation } from './msq-question-statistics-calculation';
import { FeedbackMsqQuestionDetails, FeedbackMsqResponseDetails } from '../../../../../types/api-output';
import { NO_VALUE } from '../../../../../types/feedback-response-details';

describe('MsqQuestionStatisticsCalculation', () => {
  let calculator: MsqQuestionStatisticsCalculation;

  beforeEach(() => {
    const question = new FeedbackMsqQuestionDetails();
    question.msqChoices = ['optionA', 'optionB', 'optionC'];
    question.otherEnabled = false;
    question.hasAssignedWeights = false;
    question.msqWeights = [1, 2, 3];
    question.msqOtherWeight = null;
    calculator = new MsqQuestionStatisticsCalculation(question);
  });

  it('should calculate statistics with all numeric weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [1, 2, 3];
    
    const response1 = { responseDetails: { answers: ['optionA', 'optionB'], isOther: false } } as any;
    const response2 = { responseDetails: { answers: ['optionC'], isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    expect(calculator.answerFrequency['optionA']).toBe(1);
    expect(calculator.answerFrequency['optionB']).toBe(1);
    expect(calculator.answerFrequency['optionC']).toBe(1);
  });

  it('should handle mixed null and numeric weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [1, null, 3];
    
    const response1 = { responseDetails: { answers: ['optionA', 'optionB'], isOther: false } } as any;
    const response2 = { responseDetails: { answers: ['optionC'], isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // Weight display: null should be converted to 0 in weightPerOption for display purposes
    expect(calculator.weightPerOption['optionA']).toBe(1);
    expect(calculator.weightPerOption['optionB']).toBe(0);
    expect(calculator.weightPerOption['optionC']).toBe(3);
  });

  it('should handle all null weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [null, null, null];
    
    const response1 = { responseDetails: { answers: ['optionA', 'optionB'], isOther: false } } as any;
    const response2 = { responseDetails: { answers: ['optionC'], isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // All null weights should all display as 0
    expect(calculator.weightPerOption['optionA']).toBe(0);
    expect(calculator.weightPerOption['optionB']).toBe(0);
    expect(calculator.weightPerOption['optionC']).toBe(0);
  });

  it('should handle null otherWeight when other option is enabled', () => {
    calculator.question.otherEnabled = true;
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [1, 2, 3];
    calculator.question.msqOtherWeight = null;
    
    const response1 = { responseDetails: { answers: ['optionA'], isOther: false } } as any;
    const response2 = { responseDetails: { answers: ['otherAnswer'], isOther: true } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // Other should still count in frequency
    expect(calculator.answerFrequency['Other']).toBe(1);
    // Other weight should display as 0 when null
    expect(calculator.weightPerOption['Other']).toBe(0);
  });

  it('should not crash when input is empty', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [];
    calculator.responses = [];

    expect(() => {
      calculator.calculateStatistics();
    }).not.toThrow();
  });

  it('should correctly calculate weighted percentage with mixed null weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.msqWeights = [2, null, 3];
    
    // Response 1: optionA (weight 2) and optionB (weight null)
    // Response 2: optionA (weight 2)
    const response1 = { responseDetails: { answers: ['optionA', 'optionB'], isOther: false } } as any;
    const response2 = { responseDetails: { answers: ['optionA'], isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // Frequency: optionA=2, optionB=1, optionC=0
    expect(calculator.answerFrequency['optionA']).toBe(2);
    expect(calculator.answerFrequency['optionB']).toBe(1);
    expect(calculator.answerFrequency['optionC']).toBe(0);

    // Weighted calculation should skip null weights
    // optionA: 2 responses * weight 2 = 4
    // Total weighted: 4
    // optionA weighted percentage: 4/4 = 100%
    expect(calculator.weightedPercentagePerOption['optionA']).toBe(100);
    expect(calculator.weightedPercentagePerOption['optionB']).toBeUndefined();
  });
});
