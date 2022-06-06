package com.cebuc.ing.service.mapper;

import com.cebuc.ing.domain.Owners;
import com.cebuc.ing.domain.Pets;
import com.cebuc.ing.domain.Types;
import com.cebuc.ing.service.dto.OwnersDTO;
import com.cebuc.ing.service.dto.PetsDTO;
import com.cebuc.ing.service.dto.TypesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pets} and its DTO {@link PetsDTO}.
 */
@Mapper(componentModel = "spring")
public interface PetsMapper extends EntityMapper<PetsDTO, Pets> {
    @Mapping(target = "type", source = "type", qualifiedByName = "typesId")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "ownersId")
    PetsDTO toDto(Pets s);

    @Named("typesId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TypesDTO toDtoTypesId(Types types);

    @Named("ownersId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OwnersDTO toDtoOwnersId(Owners owners);
}
