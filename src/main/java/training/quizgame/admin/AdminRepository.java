package training.quizgame.admin;

import org.springframework.data.mongodb.repository.MongoRepository;
import training.quizgame.question.Question;

public interface AdminRepository extends MongoRepository<Question, String> {
}
