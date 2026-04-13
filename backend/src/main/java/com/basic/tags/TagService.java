package com.basic.tags;

import com.basic.auth.AccessCheck;
import com.basic.users.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final AccessCheck accessCheck;

    public TagResponse createTag(TagRequest request) {
        UserModel user = accessCheck.currentUser();
        
        tagRepository.findByNameAndUser(request.getName(), user).ifPresent(tag -> {
            throw new RuntimeException("Tag with this name already exists for this user");
        });

        TagModel tag = TagModel.builder()
                .name(request.getName())
                .user(user)
                .build();

        return mapToResponse(tagRepository.save(tag));
    }

    public List<TagResponse> getAllTags() {
        UserModel user = accessCheck.currentUser();
        return tagRepository.findAllByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TagResponse getTagById(UUID id) {
        TagModel tag = findTagAndCheckAccess(id);
        return mapToResponse(tag);
    }

    public TagResponse updateTag(UUID id, TagRequest request) {
        TagModel tag = findTagAndCheckAccess(id);
        
        tag.setName(request.getName());
        return mapToResponse(tagRepository.save(tag));
    }

    public void deleteTag(UUID id) {
        TagModel tag = findTagAndCheckAccess(id);
        tagRepository.delete(tag);
    }

    private TagModel findTagAndCheckAccess(UUID id) {
        TagModel tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        UserModel user = accessCheck.currentUser();
        if (!tag.getUser().getId().equals(user.getId()) && !accessCheck.isAdmin()) {
            throw new RuntimeException("Unauthorized to access this tag");
        }
        
        return tag;
    }

    public TagResponse mapToResponse(TagModel tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }
}
