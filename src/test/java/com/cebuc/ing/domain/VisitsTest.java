package com.cebuc.ing.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cebuc.ing.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VisitsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Visits.class);
        Visits visits1 = new Visits();
        visits1.setId(1L);
        Visits visits2 = new Visits();
        visits2.setId(visits1.getId());
        assertThat(visits1).isEqualTo(visits2);
        visits2.setId(2L);
        assertThat(visits1).isNotEqualTo(visits2);
        visits1.setId(null);
        assertThat(visits1).isNotEqualTo(visits2);
    }
}
