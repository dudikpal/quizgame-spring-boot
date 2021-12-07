package training.quizgame.question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpgradeQuestionCommand {

    private String question;

    private String[] answers;

    private String correctAnswerId;

    private String categoryId;
}
