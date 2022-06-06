package com.cebuc.ing.repository.rowmapper;

import com.cebuc.ing.domain.Specialties;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Specialties}, with proper type conversions.
 */
@Service
public class SpecialtiesRowMapper implements BiFunction<Row, String, Specialties> {

    private final ColumnConverter converter;

    public SpecialtiesRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Specialties} stored in the database.
     */
    @Override
    public Specialties apply(Row row, String prefix) {
        Specialties entity = new Specialties();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setName(converter.fromRow(row, prefix + "_name", String.class));
        return entity;
    }
}
