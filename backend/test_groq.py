from app.services.llm_service import generate_answer


context = """
Clause 7 - Termination

Either party may terminate this agreement
by providing 30 days written notice.
"""


question = "What is the termination notice period?"


answer = generate_answer(
    question=question,
    context=context
)


print("\n========== CLAUSELENS AI ==========\n")

print(answer)