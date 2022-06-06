package com.cebuc.ing.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.cebuc.ing.IntegrationTest;
import com.cebuc.ing.domain.Owners;
import com.cebuc.ing.repository.EntityManager;
import com.cebuc.ing.repository.OwnersRepository;
import com.cebuc.ing.service.dto.OwnersDTO;
import com.cebuc.ing.service.mapper.OwnersMapper;
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
 * Integration tests for the {@link OwnersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class OwnersResourceIT {

    private static final String DEFAULT_FIRSTNAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRSTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_LASTNAME = "AAAAAAAAAA";
    private static final String UPDATED_LASTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/owners";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OwnersRepository ownersRepository;

    @Autowired
    private OwnersMapper ownersMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Owners owners;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Owners createEntity(EntityManager em) {
        Owners owners = new Owners()
            .firstname(DEFAULT_FIRSTNAME)
            .lastname(DEFAULT_LASTNAME)
            .address(DEFAULT_ADDRESS)
            .city(DEFAULT_CITY)
            .telephone(DEFAULT_TELEPHONE);
        return owners;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Owners createUpdatedEntity(EntityManager em) {
        Owners owners = new Owners()
            .firstname(UPDATED_FIRSTNAME)
            .lastname(UPDATED_LASTNAME)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .telephone(UPDATED_TELEPHONE);
        return owners;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Owners.class).block();
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
        owners = createEntity(em);
    }

    @Test
    void createOwners() throws Exception {
        int databaseSizeBeforeCreate = ownersRepository.findAll().collectList().block().size();
        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeCreate + 1);
        Owners testOwners = ownersList.get(ownersList.size() - 1);
        assertThat(testOwners.getFirstname()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(testOwners.getLastname()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(testOwners.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testOwners.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testOwners.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
    }

    @Test
    void createOwnersWithExistingId() throws Exception {
        // Create the Owners with an existing ID
        owners.setId(1L);
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        int databaseSizeBeforeCreate = ownersRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkFirstnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = ownersRepository.findAll().collectList().block().size();
        // set the field null
        owners.setFirstname(null);

        // Create the Owners, which fails.
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkLastnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = ownersRepository.findAll().collectList().block().size();
        // set the field null
        owners.setLastname(null);

        // Create the Owners, which fails.
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = ownersRepository.findAll().collectList().block().size();
        // set the field null
        owners.setAddress(null);

        // Create the Owners, which fails.
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTelephoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = ownersRepository.findAll().collectList().block().size();
        // set the field null
        owners.setTelephone(null);

        // Create the Owners, which fails.
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllOwners() {
        // Initialize the database
        ownersRepository.save(owners).block();

        // Get all the ownersList
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
            .value(hasItem(owners.getId().intValue()))
            .jsonPath("$.[*].firstname")
            .value(hasItem(DEFAULT_FIRSTNAME))
            .jsonPath("$.[*].lastname")
            .value(hasItem(DEFAULT_LASTNAME))
            .jsonPath("$.[*].address")
            .value(hasItem(DEFAULT_ADDRESS))
            .jsonPath("$.[*].city")
            .value(hasItem(DEFAULT_CITY))
            .jsonPath("$.[*].telephone")
            .value(hasItem(DEFAULT_TELEPHONE));
    }

    @Test
    void getOwners() {
        // Initialize the database
        ownersRepository.save(owners).block();

        // Get the owners
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, owners.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(owners.getId().intValue()))
            .jsonPath("$.firstname")
            .value(is(DEFAULT_FIRSTNAME))
            .jsonPath("$.lastname")
            .value(is(DEFAULT_LASTNAME))
            .jsonPath("$.address")
            .value(is(DEFAULT_ADDRESS))
            .jsonPath("$.city")
            .value(is(DEFAULT_CITY))
            .jsonPath("$.telephone")
            .value(is(DEFAULT_TELEPHONE));
    }

    @Test
    void getNonExistingOwners() {
        // Get the owners
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewOwners() throws Exception {
        // Initialize the database
        ownersRepository.save(owners).block();

        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();

        // Update the owners
        Owners updatedOwners = ownersRepository.findById(owners.getId()).block();
        updatedOwners
            .firstname(UPDATED_FIRSTNAME)
            .lastname(UPDATED_LASTNAME)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .telephone(UPDATED_TELEPHONE);
        OwnersDTO ownersDTO = ownersMapper.toDto(updatedOwners);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, ownersDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
        Owners testOwners = ownersList.get(ownersList.size() - 1);
        assertThat(testOwners.getFirstname()).isEqualTo(UPDATED_FIRSTNAME);
        assertThat(testOwners.getLastname()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testOwners.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testOwners.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testOwners.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void putNonExistingOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, ownersDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateOwnersWithPatch() throws Exception {
        // Initialize the database
        ownersRepository.save(owners).block();

        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();

        // Update the owners using partial update
        Owners partialUpdatedOwners = new Owners();
        partialUpdatedOwners.setId(owners.getId());

        partialUpdatedOwners.address(UPDATED_ADDRESS).telephone(UPDATED_TELEPHONE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedOwners.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedOwners))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
        Owners testOwners = ownersList.get(ownersList.size() - 1);
        assertThat(testOwners.getFirstname()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(testOwners.getLastname()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(testOwners.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testOwners.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testOwners.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void fullUpdateOwnersWithPatch() throws Exception {
        // Initialize the database
        ownersRepository.save(owners).block();

        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();

        // Update the owners using partial update
        Owners partialUpdatedOwners = new Owners();
        partialUpdatedOwners.setId(owners.getId());

        partialUpdatedOwners
            .firstname(UPDATED_FIRSTNAME)
            .lastname(UPDATED_LASTNAME)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .telephone(UPDATED_TELEPHONE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedOwners.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedOwners))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
        Owners testOwners = ownersList.get(ownersList.size() - 1);
        assertThat(testOwners.getFirstname()).isEqualTo(UPDATED_FIRSTNAME);
        assertThat(testOwners.getLastname()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testOwners.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testOwners.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testOwners.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void patchNonExistingOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, ownersDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamOwners() throws Exception {
        int databaseSizeBeforeUpdate = ownersRepository.findAll().collectList().block().size();
        owners.setId(count.incrementAndGet());

        // Create the Owners
        OwnersDTO ownersDTO = ownersMapper.toDto(owners);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(ownersDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Owners in the database
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteOwners() {
        // Initialize the database
        ownersRepository.save(owners).block();

        int databaseSizeBeforeDelete = ownersRepository.findAll().collectList().block().size();

        // Delete the owners
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, owners.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Owners> ownersList = ownersRepository.findAll().collectList().block();
        assertThat(ownersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
