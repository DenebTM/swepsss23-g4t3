package at.qe.skeleton.models;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;

@Entity
@Table(name = "SENSOR_VALUES")
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

    public SensorValues() {
    }

    public Integer getId() {
        return id;
    }

    public Double getHumidity() {
        return humidity;
    }

    public Double getAirPressure() {
        return airPressure;
    }

    public Double getTemperature() {
        return temperature;
    }

    public Double getAirQuality() {
        return airQuality;
    }

    public Double getSoilMoisture() {
        return soilMoisture;
    }

    public Double getLightIntensity() {
        return lightIntensity;
    }
}
