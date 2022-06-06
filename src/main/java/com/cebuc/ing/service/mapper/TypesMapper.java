package com.cebuc.ing.service.mapper;

import com.cebuc.ing.domain.Types;
import com.cebuc.ing.service.dto.TypesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Types} and its DTO {@link TypesDTO}.
 */
@Mapper(componentModel = "spring")
public interface TypesMapper extends EntityMapper<TypesDTO, Types> {}
