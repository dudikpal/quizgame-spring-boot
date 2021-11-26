package training.quizgame.question;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
                command.getCorrectAnswerIndex(),
                command.getCategory()
        );
        questionRepository.save(question);

        return modelMapper.map(question, QuestionDTO.class);
    }
}
