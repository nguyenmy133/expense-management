package com.expense.management.repository;

import com.expense.management.model.entity.PasswordResetToken;
import com.expense.management.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByProfileAndUsedFalseAndExpiryDateAfter(
            Profile profile, LocalDateTime now);

    void deleteByExpiryDateBefore(LocalDateTime now);

    void deleteByProfile(Profile profile);
}
