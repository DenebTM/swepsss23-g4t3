package at.qe.skeleton.models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.GenericGenerator;

@Entity
@EqualsAndHashCode
@NoArgsConstructor
@Table(name = "SENSOR_VALUES")
@Getter
@Setter
public class SensorValues {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO , generator = "seq")
    @GenericGenerator(name = "seq", strategy = "increment")
    @Column(name = "VALUES_ID")
    private Integer id;

    @Column(name = "HUMIDITY")
    private Double humidity;

    @Column(name = "AIR_PRESSURE")
    private Double airPressure;

    @Column(name = "TEMPERATURE")
    private Double temperature;

    @Column(name = "AIR_QUALITY")
    private Double airQuality;

    @Column(name = "SOIL_MOISTURE")
    private Double soilMoisture;

    @Column(name = "LIGHT_INTENSITY")
    private Double lightIntensity;

    public Integer getId() {
        return id;
    }

}
