package at.qe.skeleton.configs;

import ch.qos.logback.classic.db.names.DBNameResolver;

import java.util.HashMap;
import java.util.Map;

/**
 * Heavily based on https://github.com/anyframejava/anyframe-logback/blob/master/samples/anyframe-sample-logback-appender/src/test/java/org/anyframe/logback/appender/db/MyDBNameResolver.java
 */
public class UserDBNameResolver implements DBNameResolver {

    private static Map<String, String> columnNameMap = new HashMap<>();
    private static Map<String, String> tableNameMap = new HashMap<>();

    @Override
    public <N extends Enum<?>> String getTableName(N tableName) {
        return tableNameMap.get(tableName.toString());
    }

    @Override
    public <N extends Enum<?>> String getColumnName(N columnName) {
        return columnNameMap.get(columnName.toString());
    }

    static{
        columnNameMap.put("CALLER_USER", UserConverter.class.getName());
    }

    static {
        tableNameMap.put("LOGGING_EVENT", "LOGGING_EVENT");
    }
}
