from app.services.llm_service import client, MODEL_NAME

print("================================")
print("Testing NVIDIA NIM")
print("================================")

print("Model:", MODEL_NAME)

try:

    response = client.chat.completions.create(

        model=MODEL_NAME,

        messages=[
            {
                "role": "user",
                "content": "Reply with exactly: NVIDIA connection working"
            }
        ],

        temperature=0.2,
        max_tokens=100,

        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": False
            }
        }
    )

    print("\nSUCCESS!")
    print("--------------------------------")
    print(response.choices[0].message.content)
    print("--------------------------------")

except Exception as e:

    print("\nERROR")
    print("--------------------------------")
    print(type(e).__name__)
    print(str(e))
    print("--------------------------------")