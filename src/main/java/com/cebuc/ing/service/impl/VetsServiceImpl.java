package com.cebuc.ing.service.impl;

import com.cebuc.ing.domain.Vets;
import com.cebuc.ing.repository.VetsRepository;
import com.cebuc.ing.service.VetsService;
import com.cebuc.ing.service.dto.VetsDTO;
import com.cebuc.ing.service.mapper.VetsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Vets}.
 */
@Service
@Transactional
public class VetsServiceImpl implements VetsService {

    private final Logger log = LoggerFactory.getLogger(VetsServiceImpl.class);

    private final VetsRepository vetsRepository;

    private final VetsMapper vetsMapper;

    public VetsServiceImpl(VetsRepository vetsRepository, VetsMapper vetsMapper) {
        this.vetsRepository = vetsRepository;
        this.vetsMapper = vetsMapper;
    }

    @Override
    public Mono<VetsDTO> save(VetsDTO vetsDTO) {
        log.debug("Request to save Vets : {}", vetsDTO);
        return vetsRepository.save(vetsMapper.toEntity(vetsDTO)).map(vetsMapper::toDto);
    }

    @Override
    public Mono<VetsDTO> update(VetsDTO vetsDTO) {
        log.debug("Request to save Vets : {}", vetsDTO);
        return vetsRepository.save(vetsMapper.toEntity(vetsDTO)).map(vetsMapper::toDto);
    }

    @Override
    public Mono<VetsDTO> partialUpdate(VetsDTO vetsDTO) {
        log.debug("Request to partially update Vets : {}", vetsDTO);

        return vetsRepository
            .findById(vetsDTO.getId())
            .map(existingVets -> {
                vetsMapper.partialUpdate(existingVets, vetsDTO);

                return existingVets;
            })
            .flatMap(vetsRepository::save)
            .map(vetsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Flux<VetsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Vets");
        return vetsRepository.findAllBy(pageable).map(vetsMapper::toDto);
    }

    public Mono<Long> countAll() {
        return vetsRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<VetsDTO> findOne(Long id) {
        log.debug("Request to get Vets : {}", id);
        return vetsRepository.findById(id).map(vetsMapper::toDto);
    }

    @Override
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Vets : {}", id);
        return vetsRepository.deleteById(id);
    }
}
