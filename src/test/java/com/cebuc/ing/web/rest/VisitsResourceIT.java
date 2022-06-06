package com.cebuc.ing.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.cebuc.ing.IntegrationTest;
import com.cebuc.ing.domain.Visits;
import com.cebuc.ing.repository.EntityManager;
import com.cebuc.ing.repository.VisitsRepository;
import com.cebuc.ing.service.dto.VisitsDTO;
import com.cebuc.ing.service.mapper.VisitsMapper;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link VisitsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class VisitsResourceIT {

    private static final Instant DEFAULT_VISITDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_VISITDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/visits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VisitsRepository visitsRepository;

    @Autowired
    private VisitsMapper visitsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Visits visits;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visits createEntity(EntityManager em) {
        Visits visits = new Visits().visitdate(DEFAULT_VISITDATE).description(DEFAULT_DESCRIPTION);
        return visits;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visits createUpdatedEntity(EntityManager em) {
        Visits visits = new Visits().visitdate(UPDATED_VISITDATE).description(UPDATED_DESCRIPTION);
        return visits;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Visits.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void setupCsrf() {
        webTestClient = webTestClient.mutateWith(csrf());
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        visits = createEntity(em);
    }

    @Test
    void createVisits() throws Exception {
        int databaseSizeBeforeCreate = visitsRepository.findAll().collectList().block().size();
        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeCreate + 1);
        Visits testVisits = visitsList.get(visitsList.size() - 1);
        assertThat(testVisits.getVisitdate()).isEqualTo(DEFAULT_VISITDATE);
        assertThat(testVisits.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createVisitsWithExistingId() throws Exception {
        // Create the Visits with an existing ID
        visits.setId(1L);
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        int databaseSizeBeforeCreate = visitsRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkVisitdateIsRequired() throws Exception {
        int databaseSizeBeforeTest = visitsRepository.findAll().collectList().block().size();
        // set the field null
        visits.setVisitdate(null);

        // Create the Visits, which fails.
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = visitsRepository.findAll().collectList().block().size();
        // set the field null
        visits.setDescription(null);

        // Create the Visits, which fails.
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllVisits() {
        // Initialize the database
        visitsRepository.save(visits).block();

        // Get all the visitsList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(visits.getId().intValue()))
            .jsonPath("$.[*].visitdate")
            .value(hasItem(DEFAULT_VISITDATE.toString()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION));
    }

    @Test
    void getVisits() {
        // Initialize the database
        visitsRepository.save(visits).block();

        // Get the visits
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, visits.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(visits.getId().intValue()))
            .jsonPath("$.visitdate")
            .value(is(DEFAULT_VISITDATE.toString()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingVisits() {
        // Get the visits
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewVisits() throws Exception {
        // Initialize the database
        visitsRepository.save(visits).block();

        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();

        // Update the visits
        Visits updatedVisits = visitsRepository.findById(visits.getId()).block();
        updatedVisits.visitdate(UPDATED_VISITDATE).description(UPDATED_DESCRIPTION);
        VisitsDTO visitsDTO = visitsMapper.toDto(updatedVisits);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, visitsDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
        Visits testVisits = visitsList.get(visitsList.size() - 1);
        assertThat(testVisits.getVisitdate()).isEqualTo(UPDATED_VISITDATE);
        assertThat(testVisits.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, visitsDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateVisitsWithPatch() throws Exception {
        // Initialize the database
        visitsRepository.save(visits).block();

        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();

        // Update the visits using partial update
        Visits partialUpdatedVisits = new Visits();
        partialUpdatedVisits.setId(visits.getId());

        partialUpdatedVisits.description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedVisits.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedVisits))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
        Visits testVisits = visitsList.get(visitsList.size() - 1);
        assertThat(testVisits.getVisitdate()).isEqualTo(DEFAULT_VISITDATE);
        assertThat(testVisits.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void fullUpdateVisitsWithPatch() throws Exception {
        // Initialize the database
        visitsRepository.save(visits).block();

        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();

        // Update the visits using partial update
        Visits partialUpdatedVisits = new Visits();
        partialUpdatedVisits.setId(visits.getId());

        partialUpdatedVisits.visitdate(UPDATED_VISITDATE).description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedVisits.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedVisits))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
        Visits testVisits = visitsList.get(visitsList.size() - 1);
        assertThat(testVisits.getVisitdate()).isEqualTo(UPDATED_VISITDATE);
        assertThat(testVisits.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, visitsDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamVisits() throws Exception {
        int databaseSizeBeforeUpdate = visitsRepository.findAll().collectList().block().size();
        visits.setId(count.incrementAndGet());

        // Create the Visits
        VisitsDTO visitsDTO = visitsMapper.toDto(visits);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(visitsDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Visits in the database
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteVisits() {
        // Initialize the database
        visitsRepository.save(visits).block();

        int databaseSizeBeforeDelete = visitsRepository.findAll().collectList().block().size();

        // Delete the visits
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, visits.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Visits> visitsList = visitsRepository.findAll().collectList().block();
        assertThat(visitsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
