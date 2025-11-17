exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        username: {
            type: "text",
            notNull: true,
            unique: true,
        },
        password: {
            type: "text",
            notNull: true,
        },
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },
        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("users");
};
