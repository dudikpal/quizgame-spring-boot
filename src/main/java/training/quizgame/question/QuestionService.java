package training.quizgame.question;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class QuestionService {

    private QuestionRepository questionRepository;

    private ModelMapper modelMapper;


    public List<QuestionDTO> findAll() {
        return questionRepository.findAll().stream()
                .map(question -> modelMapper.map(question, QuestionDTO.class))
                .collect(Collectors.toList());
    }


    public QuestionDTO create(CreateQuestionCommand command) {
        Question question = new Question(
                command.getQuestion(),
                command.getAnswers(),
                command.getCorrectAnswerId(),
                command.getCategoryId()
        );
        questionRepository.save(question);

        return modelMapper.map(question, QuestionDTO.class);
    }


    public QuestionDTO findOne(String id) {
        return modelMapper.map(questionRepository.findById(id).get(), QuestionDTO.class);
    }


    public void updateQuestion(String id, UpgradeQuestionCommand command) {
        Question question = questionRepository.findById(id).get();

        question.setQuestion(command.getQuestion());
        question.setAnswers(command.getAnswers());
        question.setCorrectAnswerId(command.getCorrectAnswerId());
        question.setCategoryId(command.getCategoryId());
        questionRepository.save(question);
    }
}
