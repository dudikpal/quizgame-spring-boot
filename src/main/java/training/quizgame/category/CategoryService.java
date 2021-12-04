package training.quizgame.category;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import training.quizgame.question.QuestionDTO;
import training.quizgame.question.QuestionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private CategoryRepository categoryRepository;

    private QuestionRepository questionRepository;

    private ModelMapper modelMapper;


    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(cat -> modelMapper.map(cat, CategoryDTO.class))
                .collect(Collectors.toList());
    }


    public CategoryDTO create(CreateCategoryCommand command) {

        Category category = new Category(command.getName());

        categoryRepository.save(category);

        return modelMapper.map(category, CategoryDTO.class);
    }


    public List<QuestionDTO> findOne(String id) {
        return questionRepository.findAll().stream()
                .filter(question -> question.getCategoryId().equals(id))
                .map(question -> modelMapper.map(question, QuestionDTO.class))
                .collect(Collectors.toList());
    }

    public int numberOfQuestions(String id) {
        return (int)questionRepository.findAll().stream()
                .filter(question -> question.getCategoryId().equals(id))
                .count();
    }
}
