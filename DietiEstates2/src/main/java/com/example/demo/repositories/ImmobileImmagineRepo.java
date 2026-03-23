package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.ImmobileImmagine;

@Repository
public interface ImmobileImmagineRepo extends JpaRepository<ImmobileImmagine, Integer> {

	List<ImmobileImmagine> findByImmobileIdImmobile(Integer idImmobile);
    
    List<ImmobileImmagine> findByImmobileIdImmobileAndIsCopertinaTrue(Integer idImmobile);
}
