package com.cebuc.ing.service;

import com.cebuc.ing.service.dto.SpecialtiesDTO;
import java.util.List;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Interface for managing {@link com.cebuc.ing.domain.Specialties}.
 */
public interface SpecialtiesService {
    /**
     * Save a specialties.
     *
     * @param specialtiesDTO the entity to save.
     * @return the persisted entity.
     */
    Mono<SpecialtiesDTO> save(SpecialtiesDTO specialtiesDTO);

    /**
     * Updates a specialties.
     *
     * @param specialtiesDTO the entity to update.
     * @return the persisted entity.
     */
    Mono<SpecialtiesDTO> update(SpecialtiesDTO specialtiesDTO);

    /**
     * Partially updates a specialties.
     *
     * @param specialtiesDTO the entity to update partially.
     * @return the persisted entity.
     */
    Mono<SpecialtiesDTO> partialUpdate(SpecialtiesDTO specialtiesDTO);

    /**
     * Get all the specialties.
     *
     * @return the list of entities.
     */
    Flux<SpecialtiesDTO> findAll();

    /**
     * Get all the specialties with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Flux<SpecialtiesDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Returns the number of specialties available.
     * @return the number of entities in the database.
     *
     */
    Mono<Long> countAll();

    /**
     * Get the "id" specialties.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Mono<SpecialtiesDTO> findOne(Long id);

    /**
     * Delete the "id" specialties.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    Mono<Void> delete(Long id);
}
