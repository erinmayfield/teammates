import { Component, Input } from '@angular/core';
import {
  FeedbackRubricQuestionDetails, FeedbackRubricResponseDetails,
} from '../../../../types/api-output';
import {
  DEFAULT_RUBRIC_QUESTION_DETAILS, DEFAULT_RUBRIC_RESPONSE_DETAILS,
} from '../../../../types/default-question-structs';
import { RUBRIC_ANSWER_NOT_CHOSEN } from '../../../../types/feedback-response-details';
import { QuestionEditAnswerFormComponent } from './question-edit-answer-form';
import {SimpleModalService} from '../../../../services/simple-modal.service';
import { SimpleModalType } from '../../simple-modal/simple-modal-type';

/**
 * The rubric question submission form for a recipient.
 */
@Component({
  selector: 'tm-rubric-question-edit-answer-form',
  templateUrl: './rubric-question-edit-answer-form.component.html',
  styleUrls: ['./rubric-question-edit-answer-form.component.scss'],
})
export class RubricQuestionEditAnswerFormComponent extends QuestionEditAnswerFormComponent
    <FeedbackRubricQuestionDetails, FeedbackRubricResponseDetails> {

  /**
   * The unique ID in the page where the component is used.
   *
   * <p>This is to ensure that only one rubric answer per sub question can be selected.
   */
  @Input()
  id: string = '';

  // constant
  readonly RUBRIC_ANSWER_NOT_CHOSEN: number = RUBRIC_ANSWER_NOT_CHOSEN;

  constructor(
  private simpleModalService: SimpleModalService
  )  {super(DEFAULT_RUBRIC_QUESTION_DETAILS(), DEFAULT_RUBRIC_RESPONSE_DETAILS());}

  /**
   * Selects an answer.
   */
  selectAnswer(subQuestionIndex: number, answerIndex: number): void {
    if (this.isDisabled) {
      return;
    }

    let newAnswer: number[] = this.responseDetails.answer.slice();
    if (newAnswer.length !== this.questionDetails.rubricSubQuestions.length) {
      // initialize new answer on the fly
      newAnswer = Array(this.questionDetails.rubricSubQuestions.length).fill(RUBRIC_ANSWER_NOT_CHOSEN);
    }

    if (newAnswer[subQuestionIndex] === answerIndex) {
      // same answer is selected: toggle as unselected
      newAnswer[subQuestionIndex] = RUBRIC_ANSWER_NOT_CHOSEN;
    } else {
      newAnswer[subQuestionIndex] = answerIndex;
    }

    this.triggerResponseDetailsChange('answer', newAnswer);
  }

  getAriaLabelForChoice(choice: String, choiceDescription: String, criteria: String): String {
    const baseAriaLabel: String = this.getAriaLabel();
    const choiceWithDescription: String = this.getChoiceWithDescription(choice, choiceDescription);
    return `${choiceWithDescription} ${baseAriaLabel} under Criteria of ${criteria}`;
  }

  getChoiceWithDescription(choice: String, choiceDescription: String): String {
    return choiceDescription ? `${choice} - ${choiceDescription}` : choice;
  }

  getInputId(id: String, row: Number, col: Number, platform: String): String {
    return `${id}-row${row}-col${col}-${platform}`;
  }

  /**
  * Handles reset rubric button click event.
  */
  resetRubricHandler(): void {
    this.simpleModalService.openConfirmationModal(`Reset rubric selections to empty?`,
        SimpleModalType.WARNING,
        'Resetting the rubric selections to empty will clear any selections made, you can re-select your answers after',
    ).result.then(() => {
      let newAnswer: number[] = [];
      newAnswer = Array(this.questionDetails.rubricSubQuestions.length).fill(RUBRIC_ANSWER_NOT_CHOSEN);
      this.triggerResponseDetailsChange('answer', newAnswer);
    }, () => {});
  }

}
