package com.cebuc.ing.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.cebuc.ing.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VetsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VetsDTO.class);
        VetsDTO vetsDTO1 = new VetsDTO();
        vetsDTO1.setId(1L);
        VetsDTO vetsDTO2 = new VetsDTO();
        assertThat(vetsDTO1).isNotEqualTo(vetsDTO2);
        vetsDTO2.setId(vetsDTO1.getId());
        assertThat(vetsDTO1).isEqualTo(vetsDTO2);
        vetsDTO2.setId(2L);
        assertThat(vetsDTO1).isNotEqualTo(vetsDTO2);
        vetsDTO1.setId(null);
        assertThat(vetsDTO1).isNotEqualTo(vetsDTO2);
    }
}
