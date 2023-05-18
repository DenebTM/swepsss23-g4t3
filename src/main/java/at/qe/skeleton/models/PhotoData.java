package at.qe.skeleton.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Arrays;
import java.time.LocalDateTime;

/**
 * Taken from https://medium.com/shoutloudz/spring-boot-upload-and-download-images-using-jpa-b1c9ef174dc0
 */

@Entity
@Table(name = "PHOTO_DATA")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PhotoData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO , generator = "seq")
    @GenericGenerator(name = "seq", strategy = "increment")
    @Column(name = "ID")
    private Integer id;

    // TODO: (in service or controller) allow saving a photo with a randomized name
    @JsonIgnore
    @Column(name = "NAME", unique = true)
    private String name;

    @Column(name = "UPLOADED")
    private LocalDateTime uploaded;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "SS_ID")
    private SensorStation sensorStation;

    @JsonIgnore
    @JdbcTypeCode(SqlTypes.LONG32VARBINARY)
    @Column(name = "CONTENT", length = 1000)
    private byte[] content;

    public LocalDateTime getUploaded() {
        return uploaded;
    }

    public void setUploaded(LocalDateTime uploaded) {
        this.uploaded = uploaded;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public SensorStation getSensorStation() {
        return sensorStation;
    }

    public void setSensorStation(SensorStation sensorStation) {
        this.sensorStation = sensorStation;
    }

    public PhotoData(String name, SensorStation sensorStation, byte[] content) {
        this.name = name;
        this.sensorStation = sensorStation;
        this.content = content;
    }
}