import { McqQuestionStatisticsCalculation } from './mcq-question-statistics-calculation';
import { FeedbackMcqQuestionDetails, FeedbackMcqResponseDetails } from '../../../../../types/api-output';
import { NO_VALUE } from '../../../../../types/feedback-response-details';

describe('McqQuestionStatisticsCalculation', () => {
  let calculator: McqQuestionStatisticsCalculation;

  beforeEach(() => {
    const question = new FeedbackMcqQuestionDetails();
    question.mcqChoices = ['optionA', 'optionB', 'optionC'];
    question.otherEnabled = false;
    question.hasAssignedWeights = false;
    question.mcqWeights = [1, 2, 3];
    question.mcqOtherWeight = null;
    calculator = new McqQuestionStatisticsCalculation(question);
  });

  it('should calculate statistics with all numeric weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.mcqWeights = [1, 2, 3];
    
    const response1 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response2 = { responseDetails: { answer: 'optionB', isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    expect(calculator.answerFrequency['optionA']).toBe(1);
    expect(calculator.answerFrequency['optionB']).toBe(1);
    expect(calculator.answerFrequency['optionC']).toBe(0);
  });

  it('should handle mixed null and numeric weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.mcqWeights = [1, null, 3];
    
    const response1 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response2 = { responseDetails: { answer: 'optionB', isOther: false } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // Weight display: null should be converted to 0 in weightPerOption for display purposes
    expect(calculator.weightPerOption['optionA']).toBe(1);
    expect(calculator.weightPerOption['optionB']).toBe(0);
    expect(calculator.weightPerOption['optionC']).toBe(3);
  });

  it('should handle all null weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.mcqWeights = [null, null, null];
    
    const response1 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response2 = { responseDetails: { answer: 'optionB', isOther: false } } as any;
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
    calculator.question.mcqWeights = [1, 2, 3];
    calculator.question.mcqOtherWeight = null;
    
    const response1 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response2 = { responseDetails: { answer: 'optherAnswer', isOther: true } } as any;
    calculator.responses = [response1, response2];

    calculator.calculateStatistics();

    // Other should still count in frequency
    expect(calculator.answerFrequency['Other']).toBe(1);
    // Other weight should display as 0 when null
    expect(calculator.weightPerOption['Other']).toBe(0);
  });

  it('should not crash when input is empty', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.mcqWeights = [];
    calculator.responses = [];

    expect(() => {
      calculator.calculateStatistics();
    }).not.toThrow();
  });

  it('should correctly calculate weighted percentage with mixed null weights', () => {
    calculator.question.hasAssignedWeights = true;
    calculator.question.mcqWeights = [2, null, 3];
    
    // 2 responses to optionA (weight 2), 1 response to optionB (weight null)
    const response1 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response2 = { responseDetails: { answer: 'optionA', isOther: false } } as any;
    const response3 = { responseDetails: { answer: 'optionB', isOther: false } } as any;
    calculator.responses = [response1, response2, response3];

    calculator.calculateStatistics();

    // Weighted calculation should skip null weights
    // Only optionA (weight 2) is considered: 2 * 2 = 4 weighted responses
    // Total weighted: 4
    // optionA weighted percentage: 4/4 = 100%
    expect(calculator.weightedPercentagePerOption['optionA']).toBe(100);
    expect(calculator.weightedPercentagePerOption['optionB']).toBeUndefined();
  });
});
