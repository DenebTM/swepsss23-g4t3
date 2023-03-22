package at.qe.skeleton.model;

import jakarta.persistence.*;
import org.apache.catalina.LifecycleState;

import java.util.List;

@Entity
@Table(name = "SENSOR_VALUES")
public class SensorValues {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "VALUES_ID")
    private Long valuesID;

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

    public Long getValuesID() {
        return valuesID;
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
