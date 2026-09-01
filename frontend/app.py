import streamlit as st
import requests


# ==================================================
# Configuration
# ==================================================

BACKEND_URL = "http://127.0.0.1:8000"


# ==================================================
# Page Configuration
# ==================================================

st.set_page_config(
    page_title="ClauseLens AI",
    page_icon="⚖️",
    layout="wide"
)


# ==================================================
# Header
# ==================================================

st.title("⚖️ ClauseLens AI")

st.subheader(
    "AI-Powered Contract Analysis"
)

st.write(
    "Upload a contract to extract clauses, "
    "identify potential risks, and ask questions "
    "using AI."
)


# ==================================================
# Sidebar
# ==================================================

with st.sidebar:

    st.header("ClauseLens AI")

    st.write(
        "Legal Contract Assistant"
    )

    st.divider()

    st.write("📄 Documents")
    st.write("📑 Clauses")
    st.write("⚠️ Risk Analysis")
    st.write("💬 Ask Contract")


# ==================================================
# Session State
# ==================================================

if "document_id" not in st.session_state:

    st.session_state.document_id = None


if "filename" not in st.session_state:

    st.session_state.filename = None


if "analysis" not in st.session_state:

    st.session_state.analysis = None


# ==================================================
# Upload Function
# ==================================================

def upload_document(uploaded_file):

    files = {
        "file": (
            uploaded_file.name,
            uploaded_file.getvalue(),
            uploaded_file.type
        )
    }

    response = requests.post(
        f"{BACKEND_URL}/documents/upload",
        files=files,
        timeout=120
    )

    return response

def analyze_document(document_id):

    response = requests.post(
        f"{BACKEND_URL}/documents/{document_id}/analyze",
        timeout=300
    )

    return response


def process_document(document_id):

    return requests.post(
        f"{BACKEND_URL}/documents/{document_id}/process",
        timeout=300
    )
# ==================================================
# Upload Section
# ==================================================

st.header("📄 Upload Contract")

uploaded_file = st.file_uploader(
    "Choose a contract",
    type=[
        "pdf",
        "docx",
        "png",
        "jpg",
        "jpeg"
    ]
)


if uploaded_file:

    st.success(
        f"Selected: {uploaded_file.name}"
    )

    st.write(
        f"Size: "
        f"{uploaded_file.size / 1024:.2f} KB"
    )


    # ==============================================
    # Upload button
    # ==============================================

    if st.button(
        "🚀 Upload Contract",
        type="primary"
    ):

        try:

            with st.spinner(
                "Uploading contract..."
            ):

                response = upload_document(
                    uploaded_file
                )


            # ======================================
            # Successful response
            # ======================================

            if response.status_code in [200, 201]:

                data = response.json()

                st.session_state.document_id = (
                    data.get("document_id")
                )

                st.session_state.filename = (
                    uploaded_file.name
                )

                st.success(
                    "Contract uploaded successfully!"
                )

                st.write(
                    "Document ID:"
                )

                st.code(
                    st.session_state.document_id
                )


            else:

                st.error(
                    "Upload failed."
                )

                st.code(
                    response.text
                )


        except requests.exceptions.ConnectionError:

            st.error(
                "Could not connect to the "
                "FastAPI backend."
            )

            st.info(
                "Make sure FastAPI is running on "
                "http://127.0.0.1:8000"
            )


        except requests.exceptions.Timeout:

            st.error(
                "The backend took too long "
                "to respond."
            )


        except Exception as e:

            st.error(
                f"Unexpected error: {str(e)}"
            )


# ==================================================
# Uploaded Document Information
# ==================================================

if st.session_state.document_id:

    st.divider()

    st.header("📋 Current Contract")

    col1, col2 = st.columns(2)

    with col1:

        st.metric(
            "Document",
            st.session_state.filename
        )

    with col2:

        st.metric(
            "Status",
            "Uploaded"
        )


    st.write("")


    # ==========================================
    # Analyze Contract
    # ==========================================

    if st.button(
        "🔍 Analyze Contract",
        type="primary",
        use_container_width=True
    ):

        try:

            with st.spinner(
                "Analyzing contract... This may take a while."
            ):

                process_response = process_document(
                    st.session_state.document_id
                )

                if process_response.status_code != 200:

                    st.error(
                        "Contract processing failed."
                    )

                    st.code(
                        process_response.text
                    )

                    st.stop()

                response = analyze_document(
                    st.session_state.document_id
                )


            if response.status_code == 200:

                data = response.json()

                st.session_state.analysis = data

                st.success(
                    "Contract analysis completed!"
                )

            else:

                st.error(
                    "Contract analysis failed."
                )

                st.code(
                    response.text
                )


        except requests.exceptions.Timeout:

            st.error(
                "Analysis took too long. "
                "Please try again."
            )


        except requests.exceptions.ConnectionError:

            st.error(
                "Could not connect to FastAPI."
            )


        except Exception as e:

            st.error(
                f"Error: {str(e)}"
            )


# ==================================================
# Analysis Dashboard
# ==================================================

if st.session_state.analysis:

    analysis = st.session_state.analysis

    st.divider()

    st.header("📊 Contract Analysis")


    # ==============================================
    # Main metrics
    # ==============================================

    col1, col2, col3, col4 = st.columns(4)


    with col1:

        st.metric(
            "Overall Risk",
            analysis.get(
                "overall_risk",
                "UNKNOWN"
            )
        )


    with col2:

        st.metric(
            "Risk Score",
            f"{analysis.get('risk_score', 0)}/100"
        )


    with col3:

        st.metric(
            "Clauses",
            analysis.get(
                "total_clauses",
                0
            )
        )


    with col4:

        st.metric(
            "Risks",
            analysis.get(
                "total_risks",
                0
            )
        )

    st.subheader("⚠️ Identified Risks")

    risks = analysis.get(
        "risks",
        []
    )

    if not risks:

        st.success(
            "No potentially risky clauses were identified."
        )

    else:

        for risk in risks:

            level = risk.get(
                "risk_level",
                "MEDIUM"
            )

            if level == "HIGH":

                icon = "🔴"

            elif level == "MEDIUM":

                icon = "🟡"

            else:

                icon = "🟢"


            with st.expander(
                f"{icon} {risk.get('title', 'Risk')}"
            ):

                col1, col2, col3 = st.columns(3)

                with col1:

                    st.write(
                        f"**Level:** {level}"
                    )

                with col2:

                    st.write(
                        f"**Score:** {risk.get('score', 0)}"
                    )

                with col3:

                    st.write(
                        f"**Page:** {risk.get('page', 'N/A')}"
                    )


                st.write(
                    f"**Category:** "
                    f"{risk.get('category', 'Other')}"
                )


                st.write(
                    f"**Explanation:** "
                    f"{risk.get('explanation', '')}"
                )


                st.write(
                    f"**Why:** "
                    f"{risk.get('reason', '')}"
                )


    st.subheader("📑 Extracted Clauses")

    clauses = analysis.get(
        "clauses",
        []
    )

    if not clauses:

        st.info(
            "No clauses were extracted."
        )

    else:

        for clause in clauses:

            with st.expander(
                f"{clause.get('clause_type', 'Other')} — "
                f"{clause.get('title', 'Untitled Clause')}"
            ):

                st.write(
                    f"**Page:** "
                    f"{clause.get('page', 'N/A')}"
                )

                st.write(
                    f"**Summary:** "
                    f"{clause.get('summary', '')}"
                )


                key_points = clause.get(
                    "key_points",
                    []
                )


                if key_points:

                    st.write("**Key Points:**")

                    for point in key_points:

                        st.write(
                            f"- {point}"
                        )


                st.caption(
                    f"Source: {clause.get('chunk_id', 'N/A')}"
                )


# ==================================================
# Ask Your Contract
# ==================================================

st.divider()

st.header("💬 Ask Your Contract")

if not st.session_state.document_id:

    st.info(
        "Upload a contract first to start asking questions."
    )

else:

    question = st.text_input(
        "Ask a question about this contract",
        placeholder="e.g. What is the termination notice period?"
    )

    if st.button(
        "🔎 Ask Contract",
        type="primary"
    ):

        if not question.strip():

            st.warning(
                "Please enter a question."
            )

        else:

            try:

                with st.spinner(
                    "Searching the contract..."
                ):

                    response = requests.post(
                        f"{BACKEND_URL}/chat/",
                        params={
                            "document_id":
                                st.session_state.document_id,

                            "question":
                                question
                        },
                        timeout=120
                    )


                # ==================================
                # Successful response
                # ==================================

                if response.status_code == 200:

                    data = response.json()

                    answer = data.get(
                        "answer",
                        "No answer returned."
                    )

                    citations = data.get(
                        "citations",
                        []
                    )


                    st.subheader(
                        "🤖 ClauseLens Answer"
                    )

                    st.write(answer)


                    # ==================================
                    # Citations
                    # ==================================

                    if citations:

                        st.subheader(
                            "📌 Sources"
                        )

                        for citation in citations:

                            page = citation.get(
                                "page",
                                "N/A"
                            )

                            chunk_id = citation.get(
                                "chunk_id",
                                "N/A"
                            )

                            excerpt = citation.get(
                                "excerpt",
                                ""
                            )


                            with st.expander(
                                f"Page {page} — {chunk_id}"
                            ):

                                st.write(
                                    excerpt
                                )

                    else:

                        st.info(
                            "No supporting citation was returned."
                        )


                # ==================================
                # Backend error
                # ==================================

                else:

                    st.error(
                        "Could not answer the question."
                    )

                    st.code(
                        response.text
                    )


            except requests.exceptions.ConnectionError:

                st.error(
                    "Could not connect to FastAPI."
                )


            except requests.exceptions.Timeout:

                st.error(
                    "The request took too long."
                )


            except Exception as e:

                st.error(
                    f"Unexpected error: {str(e)}"
                )
