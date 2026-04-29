/**
 * Interface defines common fields for MCQ MSQ stats calculation.
 */
export interface McqMsqQuestionStatisticsCalculation {
  answerFrequency: Record<string, number>;
  percentagePerOption: Record<string, number>;
  weightPerOption: Record<string, number | null>;
  weightedPercentagePerOption: Record<string, number | null>;
  perRecipientResponses: Record<string, any>;
}
