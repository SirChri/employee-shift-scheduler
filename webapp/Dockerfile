FROM tomcat:jre21
ADD https://github.com/SirChri/employee-shift-scheduler/releases/latest/download/ess-v0.9.2.war /tmp/ess.war
RUN apt-get update && apt-get install unzip
RUN unzip /tmp/ess.war -d /usr/local/tomcat/webapps/ess

WORKDIR /usr/local/tomcat/webapps/ess
ARG DB_HOST
ARG DB_USER
ARG DB_USER_PW
ARG DB_NAME
ARG DB_PORT

RUN echo -e "spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect\nspring.datasource.url=jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME\nspring.datasource.username=$DB_USER\nspring.datasource.password=$DB_USER_PW\n\nspring.jpa.generate-ddl=false\nspring.jpa.hibernate.ddl-auto=validate\nspring.jpa.properties.hibernate.jdbc.time_zone=UTC\nspring.session.store-type=jdbc\nspring.session.jdbc.initialize-schema=never\n\nhibernate.cache.use_second_level_cache=true\nhibernate.cache.region.factory_class=org.hibernate.cache.ehcache.EhCacheRegionFactory\n\nspring.flyway.baselineOnMigrate = true\n\nlogging.level.org.springframework=INFO\nlogging.level.io.sirchri=INFO\nlogging.level.org.springframework.security=INFO\n\nlogging.file=ess.log\n\nlogging.pattern.file=%d %p %c{1.} [%t] %m%n\n\nlogging.pattern.console=%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" > /usr/local/tomcat/webapps/ess/WEB-INF/classes/application.properties

CMD ["catalina.sh", "run"]