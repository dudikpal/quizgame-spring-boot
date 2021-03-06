package training.quizgame.question;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@AllArgsConstructor
public class QuestionController {

    private QuestionService questionService;


    @GetMapping
    public List<QuestionDTO> findAll() {
        return questionService.findAll();
    }


    @GetMapping("/{id}")
    public QuestionDTO findOne(@PathVariable String id) {
        return questionService.findOne(id);
    }


    @PostMapping
    public QuestionDTO createQuestion(@RequestBody CreateQuestionCommand command) {
        return questionService.create(command);
    }


    @PutMapping("/{id}")
    public void updateQuestion(@PathVariable String id, @RequestBody UpgradeQuestionCommand command) {
        questionService.updateQuestion(id, command);
    }
}
