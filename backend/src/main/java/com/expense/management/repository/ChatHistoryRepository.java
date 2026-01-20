package com.expense.management.repository;

import com.expense.management.model.entity.ChatHistory;
import com.expense.management.model.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {

    Page<ChatHistory> findByUserOrderByCreatedAtDesc(Profile user, Pageable pageable);

    void deleteByUser(Profile user);
}
