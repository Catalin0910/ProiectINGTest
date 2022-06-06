package com.cebuc.ing.service;

import com.cebuc.ing.service.dto.OwnersDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link com.cebuc.ing.domain.Owners}.
 */
public interface OwnersService {
    /**
     * Save a owners.
     *
     * @param ownersDTO the entity to save.
     * @return the persisted entity.
     */
    Mono<OwnersDTO> save(OwnersDTO ownersDTO);

    /**
     * Updates a owners.
     *
     * @param ownersDTO the entity to update.
     * @return the persisted entity.
     */
    Mono<OwnersDTO> update(OwnersDTO ownersDTO);

    /**
     * Partially updates a owners.
     *
     * @param ownersDTO the entity to update partially.
     * @return the persisted entity.
     */
    Mono<OwnersDTO> partialUpdate(OwnersDTO ownersDTO);

    /**
     * Get all the owners.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<OwnersDTO> findAll(Pageable pageable);

    /**
     * Returns the number of owners available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" owners.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<OwnersDTO> findOne(Long id);

    /**
     * Delete the "id" owners.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(Long id);
}
