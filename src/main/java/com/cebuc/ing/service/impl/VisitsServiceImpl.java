package com.cebuc.ing.service.impl;

import com.cebuc.ing.domain.Visits;
import com.cebuc.ing.repository.VisitsRepository;
import com.cebuc.ing.service.VisitsService;
import com.cebuc.ing.service.dto.VisitsDTO;
import com.cebuc.ing.service.mapper.VisitsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Visits}.
 */
@Service
@Transactional
public class VisitsServiceImpl implements VisitsService {

    private final Logger log = LoggerFactory.getLogger(VisitsServiceImpl.class);

    private final VisitsRepository visitsRepository;

    private final VisitsMapper visitsMapper;

    public VisitsServiceImpl(VisitsRepository visitsRepository, VisitsMapper visitsMapper) {
        this.visitsRepository = visitsRepository;
        this.visitsMapper = visitsMapper;
    }

    @Override
    public Mono<VisitsDTO> save(VisitsDTO visitsDTO) {
        log.debug("Request to save Visits : {}", visitsDTO);
        return visitsRepository.save(visitsMapper.toEntity(visitsDTO)).map(visitsMapper::toDto);
    }

    @Override
    public Mono<VisitsDTO> update(VisitsDTO visitsDTO) {
        log.debug("Request to save Visits : {}", visitsDTO);
        return visitsRepository.save(visitsMapper.toEntity(visitsDTO)).map(visitsMapper::toDto);
    }

    @Override
    public Mono<VisitsDTO> partialUpdate(VisitsDTO visitsDTO) {
        log.debug("Request to partially update Visits : {}", visitsDTO);

        return visitsRepository
            .findById(visitsDTO.getId())
            .map(existingVisits -> {
                visitsMapper.partialUpdate(existingVisits, visitsDTO);

                return existingVisits;
            })
            .flatMap(visitsRepository::save)
            .map(visitsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<VisitsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Visits");
        return visitsRepository.findAllBy(pageable).map(visitsMapper::toDto);
    }

    public Mono<Long> countAll() {
        return visitsRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<VisitsDTO> findOne(Long id) {
        log.debug("Request to get Visits : {}", id);
        return visitsRepository.findById(id).map(visitsMapper::toDto);
    }

    @Override
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Visits : {}", id);
        return visitsRepository.deleteById(id);
    }
}
