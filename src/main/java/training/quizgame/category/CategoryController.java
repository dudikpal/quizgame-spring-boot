package training.quizgame.category;

import org.springframework.web.bind.annotation.*;
import training.quizgame.question.QuestionDTO;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }


    @GetMapping
    public List<CategoryDTO> findAll() {
        return categoryService.findAll();
    }


    @GetMapping("/{id}/count")
    public int numberOfQuestions(@PathVariable String id) {
        return categoryService.numberOfQuestions(id);
    }


    @GetMapping("/{id}")
    public List<QuestionDTO> findOne(@PathVariable String id) {
        return categoryService.findOne(id);
    }


    @PostMapping
    public CategoryDTO createCategory(@RequestBody CreateCategoryCommand command) {
        return categoryService.create(command);
    }
}
