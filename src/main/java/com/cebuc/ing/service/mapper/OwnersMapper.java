package com.cebuc.ing.service.mapper;

import com.cebuc.ing.domain.Owners;
import com.cebuc.ing.service.dto.OwnersDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Owners} and its DTO {@link OwnersDTO}.
 */
@Mapper(componentModel = "spring")
public interface OwnersMapper extends EntityMapper<OwnersDTO, Owners> {}
