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

  it('should skip empty weights when calculating statistics', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, null, 3];
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.calculateStatistics();

    expect(component.weightPerOption).toEqual({ optionA: 1, optionB: null, optionC: 3 });
    expect(component.weightedPercentagePerOption).toEqual({ optionA: 100, optionC: 0 });

    component.ngOnChanges();

    expect(component.summaryRowsData[1][1].value).toBe('-');
    expect(component.summaryRowsData[1][4].value).toBe('-');
  });

  it('should use dashes for per-recipient totals when all selected weights are empty', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [null, null, 3];
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.ngOnChanges();

    expect(component.perRecipientResponses['alice@gmail.com'].total).toBeNull();
    expect(component.perRecipientResponses['alice@gmail.com'].average).toBeNull();
    expect(component.perRecipientRowsData[0][5].value).toBe('-');
    expect(component.perRecipientRowsData[0][6].value).toBe('-');
    expect(component.perRecipientResponses['charles@gmail.com'].total).toBe(0);
    expect(component.perRecipientResponses['charles@gmail.com'].average).toBe(0);
  });

  it('should display zero weight as 0 and null weight as dash in summary table', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [0, null, 3];
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.ngOnChanges();

    // optionA has zero weight: must show 0, not dash
    expect(component.summaryRowsData[0][1].value).toBe(0);
    // optionB has null weight: must show dash, not 0 or 'null'
    expect(component.summaryRowsData[1][1].value).toBe('-');
    // optionC has numeric weight: shows as-is
    expect(component.summaryRowsData[2][1].value).toBe(3);
  });

  it('should show dash in per-recipient column header for null weight option', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, null, 3];
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.ngOnChanges();

    // perRecipientColumnsData: [Team, Recipient, optionA, optionB, optionC, Total, Average]
    // MSQ uses a space before the bracket: "option [weight]"
    expect(component.perRecipientColumnsData[2].header).toBe('optionA [1.00]');
    expect(component.perRecipientColumnsData[3].header).toBe('optionB [-]');
    expect(component.perRecipientColumnsData[4].header).toBe('optionC [3.00]');
  });

  it('should calculate per-recipient total and average normally when some but not all selections have null weights', () => {
    component.question.msqChoices = ['optionA', 'optionB', 'optionC'];
    component.question.otherEnabled = false;
    component.question.hasAssignedWeights = true;
    component.question.msqWeights = [1, null, 3];
    // Alice→[optionA, optionB], Bob→[optionA], Charles→[""] (none of the above)
    component.responses = ResponseTestData.responsesNoOther as Response<FeedbackMsqResponseDetails>[];

    component.ngOnChanges();

    // Alice chose optionA (weight 1) and optionB (null) — optionA still contributes
    expect(component.perRecipientResponses['alice@gmail.com'].total).toBe(1);
    expect(component.perRecipientResponses['alice@gmail.com'].average).toBe(1);
    expect(component.perRecipientRowsData[0][5].value).toBe('1.00');
    expect(component.perRecipientRowsData[0][6].value).toBe('1.00');

    // Bob chose only optionA (weight 1) — calculates normally
    expect(component.perRecipientResponses['bob@gmail.com'].total).toBe(1);
    expect(component.perRecipientResponses['bob@gmail.com'].average).toBe(1);
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

});
