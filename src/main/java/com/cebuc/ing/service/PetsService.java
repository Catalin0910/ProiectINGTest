package com.cebuc.ing.service;

import com.cebuc.ing.service.dto.PetsDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link com.cebuc.ing.domain.Pets}.
 */
public interface PetsService {
    /**
     * Save a pets.
     *
     * @param petsDTO the entity to save.
     * @return the persisted entity.
     */
    Mono<PetsDTO> save(PetsDTO petsDTO);

    /**
     * Updates a pets.
     *
     * @param petsDTO the entity to update.
     * @return the persisted entity.
     */
    Mono<PetsDTO> update(PetsDTO petsDTO);

    /**
     * Partially updates a pets.
     *
     * @param petsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Mono<PetsDTO> partialUpdate(PetsDTO petsDTO);

    /**
     * Get all the pets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<PetsDTO> findAll(Pageable pageable);

    /**
     * Returns the number of pets available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" pets.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<PetsDTO> findOne(Long id);

    /**
     * Delete the "id" pets.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(Long id);
}
