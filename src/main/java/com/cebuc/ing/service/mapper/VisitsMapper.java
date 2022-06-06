package com.cebuc.ing.service.mapper;

import com.cebuc.ing.domain.Pets;
import com.cebuc.ing.domain.Visits;
import com.cebuc.ing.service.dto.PetsDTO;
import com.cebuc.ing.service.dto.VisitsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Visits} and its DTO {@link VisitsDTO}.
 */
@Mapper(componentModel = "spring")
public interface VisitsMapper extends EntityMapper<VisitsDTO, Visits> {
    @Mapping(target = "pet", source = "pet", qualifiedByName = "petsId")
    VisitsDTO toDto(Visits s);

    @Named("petsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PetsDTO toDtoPetsId(Pets pets);
}
