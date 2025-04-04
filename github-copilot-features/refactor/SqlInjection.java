// This is a simple Java class that demonstrates a SQL injection vulnerability.
// It constructs a SQL query by concatenating user input directly into the query string.
// This is a bad practice and can lead to SQL injection attacks.

public class SqlInjection {
    public String getUserInfo(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
        return sql;
    }
}
