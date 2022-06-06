package com.cebuc.ing.service.impl;

import com.cebuc.ing.domain.Pets;
import com.cebuc.ing.repository.PetsRepository;
import com.cebuc.ing.service.PetsService;
import com.cebuc.ing.service.dto.PetsDTO;
import com.cebuc.ing.service.mapper.PetsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Pets}.
 */
@Service
@Transactional
public class PetsServiceImpl implements PetsService {

    private final Logger log = LoggerFactory.getLogger(PetsServiceImpl.class);

    private final PetsRepository petsRepository;

    private final PetsMapper petsMapper;

    public PetsServiceImpl(PetsRepository petsRepository, PetsMapper petsMapper) {
        this.petsRepository = petsRepository;
        this.petsMapper = petsMapper;
    }

    @Override
    public Mono<PetsDTO> save(PetsDTO petsDTO) {
        log.debug("Request to save Pets : {}", petsDTO);
        return petsRepository.save(petsMapper.toEntity(petsDTO)).map(petsMapper::toDto);
    }

    @Override
    public Mono<PetsDTO> update(PetsDTO petsDTO) {
        log.debug("Request to save Pets : {}", petsDTO);
        return petsRepository.save(petsMapper.toEntity(petsDTO)).map(petsMapper::toDto);
    }

    @Override
    public Mono<PetsDTO> partialUpdate(PetsDTO petsDTO) {
        log.debug("Request to partially update Pets : {}", petsDTO);

        return petsRepository
            .findById(petsDTO.getId())
            .map(existingPets -> {
                petsMapper.partialUpdate(existingPets, petsDTO);

                return existingPets;
            })
            .flatMap(petsRepository::save)
            .map(petsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<PetsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Pets");
        return petsRepository.findAllBy(pageable).map(petsMapper::toDto);
    }

    public Mono<Long> countAll() {
        return petsRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<PetsDTO> findOne(Long id) {
        log.debug("Request to get Pets : {}", id);
        return petsRepository.findById(id).map(petsMapper::toDto);
    }

    @Override
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Pets : {}", id);
        return petsRepository.deleteById(id);
    }
}
