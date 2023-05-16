package at.qe.skeleton.configs;

import ch.qos.logback.classic.db.names.DBNameResolver;

/**
 * Heavily based on https://github.com/anyframejava/anyframe-logback/blob/master/samples/anyframe-sample-logback-appender/src/test/java/org/anyframe/logback/appender/db/MyDBNameResolver.java
 */
public class UserDBNameResolver implements DBNameResolver {

    @Override
    public <N extends Enum<?>> String getTableName(N tableName) {
        return tableName.name().toLowerCase();
    }

    @Override
    public <N extends Enum<?>> String getColumnName(N columnName) {
        switch (columnName.name().toLowerCase()) {
            case "caller_user":
                return UserConverter.class.getName();
            default:
                return columnName.name();
        }
    }

}
