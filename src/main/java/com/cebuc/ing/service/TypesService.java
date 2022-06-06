package com.cebuc.ing.service;

import com.cebuc.ing.service.dto.TypesDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link com.cebuc.ing.domain.Types}.
 */
public interface TypesService {
    /**
     * Save a types.
     *
     * @param typesDTO the entity to save.
     * @return the persisted entity.
     */
    Mono<TypesDTO> save(TypesDTO typesDTO);

    /**
     * Updates a types.
     *
     * @param typesDTO the entity to update.
     * @return the persisted entity.
     */
    Mono<TypesDTO> update(TypesDTO typesDTO);

    /**
     * Partially updates a types.
     *
     * @param typesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Mono<TypesDTO> partialUpdate(TypesDTO typesDTO);

    /**
     * Get all the types.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<TypesDTO> findAll(Pageable pageable);

    /**
     * Returns the number of types available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" types.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<TypesDTO> findOne(Long id);

    /**
     * Delete the "id" types.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(Long id);
}
