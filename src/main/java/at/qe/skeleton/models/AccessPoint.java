package at.qe.skeleton.models;

import at.qe.skeleton.models.enums.AccessPointStatus;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ACCESS_POINT")
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode
public class AccessPoint {

    @Id
    @Column(name = "AP_NAME", nullable = false)
    @NonNull
    private String name;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @Column(name = "SERVER_ADDRESS")
    @NonNull
    private String serverAddress;

    @Column(name = "CLIENT_ADDRESS")
    private String clientAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "AP_STATUS")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @NonNull
    private AccessPointStatus status;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "ssID")
    @JsonIdentityReference(alwaysAsId = true)
    @OneToMany(mappedBy = "accessPoint",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private Set<SensorStation> sensorStations = new HashSet<>();


    public AccessPoint(String name) {
        this.name = name;
    }

}
