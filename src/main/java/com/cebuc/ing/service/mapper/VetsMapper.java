package com.cebuc.ing.service.mapper;

import com.cebuc.ing.domain.Vets;
import com.cebuc.ing.service.dto.VetsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Vets} and its DTO {@link VetsDTO}.
 */
@Mapper(componentModel = "spring")
public interface VetsMapper extends EntityMapper<VetsDTO, Vets> {}
