package training.quizgame.question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import training.quizgame.category.Category;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuestionCommand {

    private String question;

    private String[] answers;

    private int correctAnswerIndex;

    private Category category;
}
