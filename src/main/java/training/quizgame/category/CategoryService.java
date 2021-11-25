package training.quizgame.category;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private CategoryRepository categoryRepository;

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
}
