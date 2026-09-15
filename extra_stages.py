# Extra "bonus" content sourced from the PDF's 11 numbered "제공 연설" dialogue sections
# that the existing case scripts (from master_situations.json / peer_data.py / elder_data.py)
# did not cover: God's name + a short video offer (PDF topic 5, partly 9), a brief hope
# message combining "미래"/영생 (topic 8) and "사망"/tract offer (topic 7), and the concrete
# meeting time detail (topic 11: "4 gio chieu Chu nhat").
#
# Appended as ONE new stage at the end of every case's stage dict (so no renumbering of the
# existing stage keys is needed), and as two extra lines appended onto the existing final
# stage (the Psalm 119:105 "den pin" / flashlight illustration for conducting a study --
# PDF topic 10).
#
# `style` controls register (this mirrors the register already used by the rest of the app,
# not a new invention):
#   "self_senior" - self is the elder/older party (younger_sibling / elder_uncle_aunt /
#                    elder_parent_age): self lines lean casual banmal, no "a" particle.
#   "self_junior" - self is the younger/junior party addressing an elder who is NOT the
#                    cha1u<->chu/co/bac pairing (older_sibling): self lines polite, listener
#                    (elder) replies casual banmal.
#   "self_junior_a" - self = "chau", listener = chu/co/bac (younger_than_parent /
#                    older_than_parent): self lines polite AND keep the "a" particle in the
#                    Vietnamese (build_final.py's existing A_EXEMPT_RELS strips it back out
#                    automatically for every other category, so writing "a" here is safe).
#   "peer"        - both sides polite (matches peer_data.py's existing house style).
#   "stranger"    - both sides polite/formal, self lines keep "a" (matches build_stranger).

def line(viet, gloss, translation, reply=None):
    return {"viet": viet, "gloss": gloss, "translation": translation, "reply": reply}


def build_extra(self_term, listener_term, style, contact_name, contact_name_kr):
    S, Scap = self_term, self_term.capitalize()
    L, Lcap = listener_term, listener_term.capitalize()
    a = " ạ" if style in ("self_junior_a", "stranger") else ""

    if style == "self_senior":
        self_k = {
            "know": f"{Lcap} có biết Đức Chúa Trời có một cái tên không?",
            "reveal": "Tên của Đức Chúa Trời là Giê-hô-va.",
            "video": f"{Scap} muốn cho {L} xem một video ngắn về tên này, được không?",
            "hope": "Kinh Thánh hứa là chúng ta có thể sống mãi mãi, không còn đau khổ hay cái chết nữa.",
            "time": "Buổi nhóm họp bắt đầu lúc bốn giờ chiều Chủ Nhật, hoàn toàn miễn phí.",
        }
        kr = {
            "know": "너, 하느님한테 이름이 있다는 거 아니?",
            "reveal": "하느님의 이름은 여호와야.",
            "video": "이 이름에 대한 짧은 영상 하나 보여줘도 될까?",
            "hope": "성경은 우리가 고통도 죽음도 없이 영원히 살 수 있다고 약속해.",
            "time": "집회는 일요일 오후 네 시에 시작하고, 완전히 무료야.",
        }
        reply_k = f"{contact_name}: Dạ, được ạ.  — 네, 좋아요."
    elif style == "peer":
        self_k = {
            "know": f"{Lcap} có biết Đức Chúa Trời có một cái tên không?",
            "reveal": "Tên của Đức Chúa Trời là Giê-hô-va.",
            "video": f"{Scap} muốn cho {L} xem một video ngắn về tên này, được không?",
            "hope": "Kinh Thánh hứa là chúng ta có thể sống mãi mãi, không còn đau khổ hay cái chết nữa.",
            "time": "Buổi nhóm họp bắt đầu lúc bốn giờ chiều Chủ Nhật, hoàn toàn miễn phí.",
        }
        kr = {
            "know": "하느님한테 이름이 있다는 거 아세요?",
            "reveal": "하느님의 이름은 여호와예요.",
            "video": "이 이름에 대한 짧은 영상 하나 보여드려도 될까요?",
            "hope": "성경은 우리가 고통도 죽음도 없이 영원히 살 수 있다고 약속해요.",
            "time": "집회는 일요일 오후 네 시에 시작하고, 완전히 무료예요.",
        }
        reply_k = f"{contact_name}: Được.  — 네, 좋아요."
    elif style == "stranger":
        self_k = {
            "know": f"{Lcap} có biết Đức Chúa Trời có một cái tên không ạ?",
            "reveal": "Tên của Đức Chúa Trời là Giê-hô-va ạ.",
            "video": f"{Scap} muốn cho {L} xem một video ngắn về tên này, được không ạ?",
            "hope": "Kinh Thánh hứa là chúng ta có thể sống mãi mãi, không còn đau khổ hay cái chết nữa ạ.",
            "time": "Buổi nhóm họp bắt đầu lúc bốn giờ chiều Chủ Nhật, hoàn toàn miễn phí ạ.",
        }
        kr = {
            "know": "하느님한테 이름이 있다는 거 아세요?",
            "reveal": "하느님의 이름은 여호와예요.",
            "video": "이 이름에 대한 짧은 영상 하나 보여드려도 될까요?",
            "hope": "성경은 우리가 고통도 죽음도 없이 영원히 살 수 있다고 약속해요.",
            "time": "집회는 일요일 오후 네 시에 시작하고, 완전히 무료예요.",
        }
        reply_k = f"{contact_name}: Ừ, được.  — 네, 좋아요."
    elif style == "self_junior_a":
        self_k = {
            "know": f"{Lcap} có biết Đức Chúa Trời có một cái tên không ạ?",
            "reveal": "Tên của Đức Chúa Trời là Giê-hô-va ạ.",
            "video": f"{Scap} muốn cho {L} xem một video ngắn về tên này, được không ạ?",
            "hope": "Kinh Thánh hứa là chúng ta có thể sống mãi mãi, không còn đau khổ hay cái chết nữa ạ.",
            "time": "Buổi nhóm họp bắt đầu lúc bốn giờ chiều Chủ Nhật, hoàn toàn miễn phí ạ.",
        }
        kr = {
            "know": "혹시 하느님한테 이름이 있다는 거 아세요?",
            "reveal": "하느님의 이름은 여호와예요.",
            "video": "이 이름에 대한 짧은 영상 하나 보여드려도 될까요?",
            "hope": "성경은 우리가 고통도 죽음도 없이 영원히 살 수 있다고 약속해요.",
            "time": "집회는 일요일 오후 네 시에 시작하고, 완전히 무료예요.",
        }
        reply_k = f"{contact_name}: Ừ, được đấy.  — 그래, 궁금하네."
    else:  # self_junior (older_sibling)
        self_k = {
            "know": f"{Lcap} có biết Đức Chúa Trời có một cái tên không?",
            "reveal": "Tên của Đức Chúa Trời là Giê-hô-va.",
            "video": f"{Scap} muốn cho {L} xem một video ngắn về tên này, được không?",
            "hope": "Kinh Thánh hứa là chúng ta có thể sống mãi mãi, không còn đau khổ hay cái chết nữa.",
            "time": "Buổi nhóm họp bắt đầu lúc bốn giờ chiều Chủ Nhật, hoàn toàn miễn phí.",
        }
        kr = {
            "know": "혹시 하느님한테 이름이 있다는 거 아세요?",
            "reveal": "하느님의 이름은 여호와예요.",
            "video": "이 이름에 대한 짧은 영상 하나 보여드려도 될까요?",
            "hope": "성경은 우리가 고통도 죽음도 없이 영원히 살 수 있다고 약속해요.",
            "time": "집회는 일요일 오후 네 시에 시작하고, 완전히 무료예요.",
        }
        reply_k = f"{contact_name}: Ừ, được.  — 그래, 궁금하네."

    return {
        "번외: 하느님의 이름과 소망": [
            line(self_k["know"], "너  있다  알다  하느님  있다  하나  이름  ~입니까?", kr["know"]),
            line(self_k["reveal"], "이름  ~의  하느님  이다  여호와", kr["reveal"]),
            line(self_k["video"], "나  원하다  주다  너  보다  영상  짧다  ~에 대해  이  이름", kr["video"],
                 reply_k),
            line(self_k["hope"], "성경  약속하다  이다  우리  가능하다  살다  영원히  ~않다  ~하다  고통  또는  죽음  또", kr["hope"]),
            line(self_k["time"], "모임  집회  시작하다  ~에  4  시  오후  일요일  완전히  무료", kr["time"]),
        ]
    }


def study_conducting_extra(style):
    """Two extra lines (Psalm 119:105 flashlight illustration, PDF topic 10) appended onto
    the existing final "성서 연구 사회" / "...연구 사회" stage of every case."""
    if style in ("self_senior",):
        v1 = "Thi thiên 119:105 nói Lời Chúa giống như cây đèn soi đường cho chúng ta."
        k1 = "시편 119편 105절은 하느님의 말씀이 우리 길을 비추는 등불과 같다고 말해."
        v2 = f"Giống như đèn pin giúp mình đi trong đêm tối, cháu nghĩ sao?"
        k2 = "어두운 밤에 손전등이 길을 밝혀주는 것처럼 말이야. 어떻게 생각해?"
    elif style == "peer":
        v1 = "Thi thiên 119:105 nói Lời Chúa giống như cây đèn soi đường cho chúng ta."
        k1 = "시편 119편 105절은 하느님의 말씀이 우리 길을 비추는 등불과 같다고 말해요."
        v2 = "Giống như đèn pin giúp mình đi trong đêm tối, cậu nghĩ sao?"
        k2 = "어두운 밤에 손전등이 길을 밝혀주는 것처럼 말이에요. 어떻게 생각하세요?"
    elif style == "stranger":
        v1 = "Thi thiên 119:105 nói Lời Chúa giống như cây đèn soi đường cho chúng ta ạ."
        k1 = "시편 119편 105절은 하느님의 말씀이 우리 길을 비추는 등불과 같다고 말해요."
        v2 = "Giống như đèn pin giúp đi trong đêm tối vậy ạ."
        k2 = "어두운 밤에 손전등이 길을 밝혀주는 것처럼 말이에요."
    elif style == "self_junior_a":
        v1 = "Thi thiên 119:105 nói Lời Chúa giống như cây đèn soi đường cho chúng ta ạ."
        k1 = "시편 119편 105절은 하느님의 말씀이 우리 길을 비추는 등불과 같다고 해요."
        v2 = "Giống như đèn pin giúp đi trong đêm tối vậy ạ."
        k2 = "어두운 밤에 손전등이 길을 밝혀주는 것처럼요."
    else:  # self_junior
        v1 = "Thi thiên 119:105 nói Lời Chúa giống như cây đèn soi đường cho chúng ta."
        k1 = "시편 119편 105절은 하느님의 말씀이 우리 길을 비추는 등불과 같다고 해요."
        v2 = "Giống như đèn pin giúp đi trong đêm tối vậy."
        k2 = "어두운 밤에 손전등이 길을 밝혀주는 것처럼요."
    return [
        line(v1, "시편  119:105  말하다  말씀  ~의  하느님  같다  ~와  등  비추다  길  ~을 위해  우리", k1),
        line(v2, "같다  ~와  등  손전등  돕다  가다  ~안에서  밤  어둡다", k2),
    ]
