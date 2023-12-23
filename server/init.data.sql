// Question Collection
db.createCollection("question", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["set_id", "number", "name", "description"],
      properties: {
        id: { bsonType: "int" },
        set_id: { bsonType: "int" },
        number: { bsonType: "int" },
        name: { bsonType: "string" },
        description: { bsonType: "string" }
      }
    }
  }
});

// Option Collection
db.createCollection("option", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["answer_id", "order", "text", "attachment_id", "description", "correct"],
      properties: {
        id: { bsonType: "int" },
        answer_id: { bsonType: "int" },
        order: { bsonType: "int" },
        text: { bsonType: "string" },
        attachment_id: { bsonType: "int" },
        description: { bsonType: "string" },
        correct: { bsonType: "int" }
      }
    }
  }
});

// User Collection
db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstname", "lastname", "email", "blocked", "role_id", "pass_code"],
      properties: {
        id: { bsonType: "int" },
        firstname: { bsonType: "string" },
        lastname: { bsonType: "string" },
        email: { bsonType: "string" },
        blocked: { bsonType: "bool" },
        role_id: { bsonType: "int" },
        pass_code: { bsonType: "string" },
        pin_prefix: { bsonType: "string" },
        pin: { bsonType: "string" },
        handy_token: { bsonType: "string" }
      }
    }
  }
});

// Role Collection
db.createCollection("role", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        id: { bsonType: "int" },
        name: { bsonType: "string" }
      }
    }
  }
});

// User Permission Collection
db.createCollection("user_permission", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "set_id"],
      properties: {
        user_id: { bsonType: "int" },
        set_id: { bsonType: "int" }
      }
    }
  }
});

// Test Run Collection
db.createCollection("test_run", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "start_on", "finish_on", "set_id"],
      properties: {
        id: { bsonType: "int" },
        user_id: { bsonType: "int" },
        start_on: { bsonType: "int" },
        finish_on: { bsonType: "int" },
        result: { bsonType: "string" }
      }
    }
  }
});

// Test Response Collection
db.createCollection("test_response", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["test_run_id", "question_id", "duration", "timestamp", "correct"],
      properties: {
        id: { bsonType: "int" },
        test_run_id: { bsonType: "int" },
        question_id: { bsonType: "int" },
        duration: { bsonType: "int" },
        timestamp: { bsonType: "int" },
        correct: { bsonType: "string" }
      }
    }
  }
});

// Test Response Option Collection
db.createCollection("test_response_option", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["test_run_id", "question_id", "duration", "timestamp", "option_id"],
      properties: {
        id: { bsonType: "int" },
        test_run_id: { bsonType: "int" },
        question_id: { bsonType: "int" },
        duration: { bsonType: "int" },
        timestamp: { bsonType: "int" },
        option_id: { bsonType: "int" }
      }
    }
  }
});

// Block IP Collection
db.createCollection("block_ip", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ip", "blocked_to"],
      properties: {
        id: { bsonType: "int" },
        ip: { bsonType: "string" },
        blocked_to: { bsonType: "int" }
      }
    }
  }
});

// Log User Login Collection
db.createCollection("log_user_login", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "timestamp"],
      properties: {
        id: { bsonType: "int" },
        user_id: { bsonType: "int" },
        timestamp: { bsonType: "int" }
      }
    }
  }
});

// Log User Login Attempt Collection
db.createCollection("log_user_login_attempt", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ip", "email", "timestamp"],
      properties: {
        id: { bsonType: "int" },
        ip: { bsonType: "string" },
        email: { bsonType: "string" },
        timestamp: { bsonType: "int" }
      }
    }
  }
});

// Mark Type Collection
db.createCollection("mark_type", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        id: { bsonType: "int" },
        name: { bsonType: "string" }
      }
    }
  }
});

// Language Collection
db.createCollection("language", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        id: { bsonType: "int" },
        name: { bsonType: "string" }
      }
    }
  }
});
