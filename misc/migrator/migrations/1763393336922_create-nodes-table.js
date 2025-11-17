exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("nodes", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        parent_id: {
            type: "uuid",
            references: "nodes(id)",
            onDelete: "CASCADE",
            default: null,
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
        },
        operation: {
            type: "text",
            check: "operation IN ('+', '-', '*', '/')",
            default: null,
        },
        right_value: {
            type: "numeric",
            default: null,
        },
        result_value: {
            type: "numeric",
            notNull: true,
        },
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },
    });

    pgm.createIndex("nodes", "parent_id");
    pgm.createIndex("nodes", "user_id");
};

exports.down = (pgm) => {
    pgm.dropTable("nodes");
};
