package com.cebuc.ing.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.cebuc.ing.IntegrationTest;
import com.cebuc.ing.domain.Pets;
import com.cebuc.ing.repository.EntityManager;
import com.cebuc.ing.repository.PetsRepository;
import com.cebuc.ing.service.dto.PetsDTO;
import com.cebuc.ing.service.mapper.PetsMapper;
import java.time.Duration;
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
 * Integration tests for the {@link PetsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PetsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_BIRTHDATE = "AAAAAAAAAA";
    private static final String UPDATED_BIRTHDATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PetsRepository petsRepository;

    @Autowired
    private PetsMapper petsMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Pets pets;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pets createEntity(EntityManager em) {
        Pets pets = new Pets().name(DEFAULT_NAME).birthdate(DEFAULT_BIRTHDATE);
        return pets;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pets createUpdatedEntity(EntityManager em) {
        Pets pets = new Pets().name(UPDATED_NAME).birthdate(UPDATED_BIRTHDATE);
        return pets;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Pets.class).block();
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
        pets = createEntity(em);
    }

    @Test
    void createPets() throws Exception {
        int databaseSizeBeforeCreate = petsRepository.findAll().collectList().block().size();
        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeCreate + 1);
        Pets testPets = petsList.get(petsList.size() - 1);
        assertThat(testPets.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPets.getBirthdate()).isEqualTo(DEFAULT_BIRTHDATE);
    }

    @Test
    void createPetsWithExistingId() throws Exception {
        // Create the Pets with an existing ID
        pets.setId(1L);
        PetsDTO petsDTO = petsMapper.toDto(pets);

        int databaseSizeBeforeCreate = petsRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = petsRepository.findAll().collectList().block().size();
        // set the field null
        pets.setName(null);

        // Create the Pets, which fails.
        PetsDTO petsDTO = petsMapper.toDto(pets);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkBirthdateIsRequired() throws Exception {
        int databaseSizeBeforeTest = petsRepository.findAll().collectList().block().size();
        // set the field null
        pets.setBirthdate(null);

        // Create the Pets, which fails.
        PetsDTO petsDTO = petsMapper.toDto(pets);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPets() {
        // Initialize the database
        petsRepository.save(pets).block();

        // Get all the petsList
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
            .value(hasItem(pets.getId().intValue()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].birthdate")
            .value(hasItem(DEFAULT_BIRTHDATE));
    }

    @Test
    void getPets() {
        // Initialize the database
        petsRepository.save(pets).block();

        // Get the pets
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, pets.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(pets.getId().intValue()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.birthdate")
            .value(is(DEFAULT_BIRTHDATE));
    }

    @Test
    void getNonExistingPets() {
        // Get the pets
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewPets() throws Exception {
        // Initialize the database
        petsRepository.save(pets).block();

        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();

        // Update the pets
        Pets updatedPets = petsRepository.findById(pets.getId()).block();
        updatedPets.name(UPDATED_NAME).birthdate(UPDATED_BIRTHDATE);
        PetsDTO petsDTO = petsMapper.toDto(updatedPets);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, petsDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
        Pets testPets = petsList.get(petsList.size() - 1);
        assertThat(testPets.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPets.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
    }

    @Test
    void putNonExistingPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, petsDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePetsWithPatch() throws Exception {
        // Initialize the database
        petsRepository.save(pets).block();

        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();

        // Update the pets using partial update
        Pets partialUpdatedPets = new Pets();
        partialUpdatedPets.setId(pets.getId());

        partialUpdatedPets.birthdate(UPDATED_BIRTHDATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPets.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPets))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
        Pets testPets = petsList.get(petsList.size() - 1);
        assertThat(testPets.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPets.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
    }

    @Test
    void fullUpdatePetsWithPatch() throws Exception {
        // Initialize the database
        petsRepository.save(pets).block();

        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();

        // Update the pets using partial update
        Pets partialUpdatedPets = new Pets();
        partialUpdatedPets.setId(pets.getId());

        partialUpdatedPets.name(UPDATED_NAME).birthdate(UPDATED_BIRTHDATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPets.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPets))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
        Pets testPets = petsList.get(petsList.size() - 1);
        assertThat(testPets.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPets.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
    }

    @Test
    void patchNonExistingPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, petsDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPets() throws Exception {
        int databaseSizeBeforeUpdate = petsRepository.findAll().collectList().block().size();
        pets.setId(count.incrementAndGet());

        // Create the Pets
        PetsDTO petsDTO = petsMapper.toDto(pets);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(petsDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Pets in the database
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePets() {
        // Initialize the database
        petsRepository.save(pets).block();

        int databaseSizeBeforeDelete = petsRepository.findAll().collectList().block().size();

        // Delete the pets
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, pets.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Pets> petsList = petsRepository.findAll().collectList().block();
        assertThat(petsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
