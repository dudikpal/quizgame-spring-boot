package training.quizgame.question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import training.quizgame.category.Category;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document("questions")
public class Question {

    @Id
    private String id;

    private String question;

    private String[] answers;

    private int correctAnswerIndex;

    private Category category;

    public Question(String question, String[] answers, int correctAnswerIndex, Category category) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerIndex = correctAnswerIndex;
        this.category = category;
    }
}
