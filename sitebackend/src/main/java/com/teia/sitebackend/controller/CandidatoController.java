package com.teia.sitebackend.controller;

import com.teia.sitebackend.dto.ApiResponse;
import com.teia.sitebackend.dto.CandidatoCadastroRequest;
import com.teia.sitebackend.dto.CandidatoDTO;
import com.teia.sitebackend.dto.LoginRequest;
import com.teia.sitebackend.factory.ResponseFactory;
import com.teia.sitebackend.exception.ResourceNotFoundException;
import com.teia.sitebackend.exception.ValidationException;
import com.teia.sitebackend.mapper.CandidatoMapper;
import com.teia.sitebackend.model.Candidato;
import com.teia.sitebackend.service.ICandidatoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/candidato")
public class CandidatoController {

    private final ICandidatoService candidatoService;
    private final CandidatoMapper candidatoMapper;

    public CandidatoController(ICandidatoService candidatoService, CandidatoMapper candidatoMapper) {
        this.candidatoService = candidatoService;
        this.candidatoMapper = candidatoMapper;
    }

    /**
     * Lista todos os candidatos (sem expor senhas)
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAll(){
        List<Candidato> candidatos = candidatoService.getAll();
        List<CandidatoDTO> candidatosDTO = candidatoMapper.toDTOList(candidatos);
        return ResponseFactory.success("Candidatos listados com sucesso", candidatosDTO);
    }

    /**
     * Cadastra um novo candidato
     */
    @PostMapping
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody CandidatoCadastroRequest request){
        // Converte DTO para Entity
        Candidato candidato = candidatoMapper.toEntity(request);
        
        // Salva (validações são feitas no service)
        Candidato savedCandidato = candidatoService.save(candidato);
        
        // Converte para DTO (sem senha)
        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(savedCandidato);
        
        return ResponseFactory.created("Cadastro realizado com sucesso!", candidatoDTO);
    }
    
    /**
     * Realiza login do candidato
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        // Valida login (lança UnauthorizedException se inválido)
        Optional<Candidato> candidato = candidatoService.validarLogin(
            loginRequest.getEmail(), 
            loginRequest.getSenha()
        );
        
        // Converte para DTO (sem senha)
        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(candidato.get());
        
        return ResponseFactory.success("Login realizado com sucesso!", candidatoDTO);
    }

    /**
     * Upload de currículo do candidato
     */
    @PostMapping(value = "/{candidatoId}/curriculo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> uploadCurriculo(
        @PathVariable String candidatoId,
        @RequestPart("file") MultipartFile file
    ) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Selecione um arquivo de currículo para envio");
        }

        final long tamanhoMaximo = 5 * 1024 * 1024;
        if (file.getSize() > tamanhoMaximo) {
            throw new ValidationException("O currículo deve ter no máximo 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf")
            && !contentType.equals("application/msword")
            && !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            throw new ValidationException("Formato inválido. Envie arquivo PDF, DOC ou DOCX");
        }

        Candidato candidatoAtualizado = candidatoService.atualizarCurriculo(
            candidatoId,
            file.getOriginalFilename(),
            contentType,
            file.getBytes()
        );

        CandidatoDTO candidatoDTO = candidatoMapper.toDTO(candidatoAtualizado);
        return ResponseFactory.success("Currículo enviado com sucesso", candidatoDTO);
    }

    /**
     * Download do currículo do candidato
     */
    @GetMapping("/{candidatoId}/curriculo")
    public ResponseEntity<byte[]> baixarCurriculo(@PathVariable String candidatoId) {
        Candidato candidato = candidatoService.getById(candidatoId)
            .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado"));

        byte[] arquivo = candidato.getCurriculoArquivo();
        if (arquivo == null || arquivo.length == 0) {
            throw new ResourceNotFoundException("Currículo não encontrado para este candidato");
        }

        String nomeArquivo = candidato.getCurriculoNomeArquivo() != null
            ? candidato.getCurriculoNomeArquivo()
            : "curriculo.pdf";

        String contentType = candidato.getCurriculoContentType() != null
            ? candidato.getCurriculoContentType()
            : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
            .body(arquivo);
    }
}
