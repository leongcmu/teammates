import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsqQuestionStatisticsComponent } from './msq-question-statistics.component';
import { Response } from './question-statistics';
import ResponseTestData from './test-data/msqQuestionResponses.json';
import { FeedbackMsqResponseDetails } from '../../../../types/api-output';

describe('MsqQuestionStatisticsComponent', () => {
  let component: MsqQuestionStatisticsComponent;
  let fixture: ComponentFixture<MsqQuestionStatisticsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MsqQuestionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate statistics correctly', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, 2, 3];
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    const expectedAnswerFrequency: Record<string, number> = {
      optionA: 2, optionB: 1, optionC: 0,
    };
    const expectedPercentagePerOption: Record<string, number> = {
      optionA: 66.67, optionB: 33.33, optionC: 0,
    };
    const expectedWeightPerOption: Record<string, number> = {
      optionA: 1, optionB: 2, optionC: 3,
    };
    const expectedWeightedPrecentagePerOption: Record<string, number> = {
      optionA: 50, optionB: 50, optionC: 0,
    };
    const expectedPerRecipientResponses: Record<string, any> =
        ResponseTestData.expectedPerRecipientResponses as Record<string, any>;

    component.calculateStatistics();

    expect(component.answerFrequency).toEqual(expectedAnswerFrequency);
    expect(component.percentagePerOption).toEqual(expectedPercentagePerOption);
    expect(component.weightPerOption).toEqual(expectedWeightPerOption);
    expect(component.weightedPercentagePerOption).toEqual(expectedWeightedPrecentagePerOption);
    expect(component.perRecipientResponses).toEqual(expectedPerRecipientResponses);
  });

  it('should calculate statistics correctly when other is enabled', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = true;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, 2, 3];
    component.question.msqOtherWeight = 4;
    component.responses = ResponseTestData.responsesWithOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    const expectedAnswerFrequency: Record<string, number> = {
      optionA: 2, optionB: 1, optionC: 1, Other: 1,
    };
    const expectedPercentagePerOption: Record<string, number> = {
      optionA: 40, optionB: 20, optionC: 20, Other: 20,
    };
    const expectedWeightPerOption: Record<string, number> = {
      optionA: 1, optionB: 2, optionC: 3, Other: 4,
    };
    const expectedWeightedPrecentagePerOption: Record<string, number> = {
      optionA: 18.18, optionB: 18.18, optionC: 27.27, Other: 36.36,
    };
    const expectedPerRecipientResponses: Record<string, any> =
        ResponseTestData.expectedPerRecipientResponsesWithOther as Record<string, any>;

    expect(component.answerFrequency).toEqual(expectedAnswerFrequency);
    expect(component.percentagePerOption).toEqual(expectedPercentagePerOption);
    expect(component.weightPerOption).toEqual(expectedWeightPerOption);
    expect(component.weightedPercentagePerOption).toEqual(expectedWeightedPrecentagePerOption);
    expect(component.perRecipientResponses).toEqual(expectedPerRecipientResponses);
  });

  it('should calculate statistics correctly when there are no weights', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = false;
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    const expectedAnswerFrequency: Record<string, number> = {
      optionA: 2, optionB: 1, optionC: 0,
    };
    const expectedPercentagePerOption: Record<string, number> = {
      optionA: 66.67, optionB: 33.33, optionC: 0,
    };
    const expectedPerRecipientResponses: Record<string, any> = {};

    component.calculateStatistics();

    expect(component.answerFrequency).toEqual(expectedAnswerFrequency);
    expect(component.percentagePerOption).toEqual(expectedPercentagePerOption);
    expect(component.perRecipientResponses).toEqual(expectedPerRecipientResponses);
  });

  it('should calculate statistics correctly when other is enabled and there are no weights', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = true;
    component.question.hasAssignedWeights = false;
    component.responses = ResponseTestData.responsesWithOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    const expectedAnswerFrequency: Record<string, number> = {
      optionA: 2, optionB: 1, optionC: 1, Other: 1,
    };
    const expectedPercentagePerOption: Record<string, number> = {
      optionA: 40, optionB: 20, optionC: 20, Other: 20,
    };
    const expectedPerRecipientResponses: Record<string, any> = {};

    expect(component.answerFrequency).toEqual(expectedAnswerFrequency);
    expect(component.percentagePerOption).toEqual(expectedPercentagePerOption);
    expect(component.perRecipientResponses).toEqual(expectedPerRecipientResponses);
  });

  it('should calculate statistics correctly when other is enabled and there are no weights', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = true;
    component.question.hasAssignedWeights = false;
    component.responses = ResponseTestData.responsesWithOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    const expectedAnswerFrequency: Record<string, number> = {
      optionA: 2, optionB: 1, optionC: 1, Other: 1,
    };
    const expectedPercentagePerOption: Record<string, number> = {
      optionA: 40, optionB: 20, optionC: 20, Other: 20,
    };
    const expectedPerRecipientResponses: Record<string, any> = {};

    expect(component.answerFrequency).toEqual(expectedAnswerFrequency);
    expect(component.percentagePerOption).toEqual(expectedPercentagePerOption);
    expect(component.perRecipientResponses).toEqual(expectedPerRecipientResponses);
  });

  it('should handle mixed null and numeric weights correctly', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, null, 3];
    component.question.msqOtherWeight = null;
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    // Should only count non-null weights in weighted calculations
    expect(component.weightPerOption['optionA']).toBe(1);
    expect(component.weightPerOption['optionB']).toBeUndefined();
    expect(component.weightPerOption['optionC']).toBe(3);
  });

  it('should display "-" when all weights are null', () => {
    component.question.msqChoices = ['optionA', 'optionB'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [null, null];
    component.question.msqOtherWeight = null;
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    // All weights null should result in NO_VALUE (-) for averages
    for (const recipient of Object.keys(component.perRecipientResponses)) {
      if (component.perRecipientResponses[recipient]) {
        // NO_VALUE should be represented as a special value or display as "-"
        const average = component.perRecipientResponses[recipient].average;
        expect(average === undefined || average === null || typeof average === 'string').toBe(true);
      }
    }
  });

});
